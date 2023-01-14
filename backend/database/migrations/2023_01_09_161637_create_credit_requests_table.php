<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCreditRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('credit_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id')->nullable()->index();
            $table->string('name');
            $table->string('phone');
            $table->string('email');
            $table->string('mssv');
            $table->text('reason');
            $table->enum('status', ['pending', 'approved', 'denied'])->default('pending');
            $table->text('deny_reason')->nullable();
            $table->bigInteger('amount')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('credit_requests');
    }
}
