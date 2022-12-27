<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('admins');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('dob');
            $table->dropColumn('mssv');
            $table->dropColumn('l_name');
            // $table->string('phone');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('mssv')->nullable();
            $table->date('dob')->nullable();
            $table->string('l_name')->nullable();
        });
    }
}
